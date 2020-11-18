<template>
  <div class="time-line-container">
    <!-- 时间选择 -->
    <div class="time-pick">
      <strong>步长单位: </strong>

      <el-radio-group v-model="stepUnit" @change="stepUnitChangeEvent">
        <el-radio-button label="年"></el-radio-button>
        <el-radio-button label="月"></el-radio-button>
        <el-radio-button label="日"></el-radio-button>
        <el-radio-button label="时"></el-radio-button>
      </el-radio-group>

      <!-- 起止时间选择 -->
      <el-date-picker
        v-model="time"
        :type="timeType"
        :format="formatType"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="dateChangeAndClearState"
        :picker-options="pickerOptions"
      >
      </el-date-picker>
    </div>

    <div class="time-line" v-show="true">
      <!-- 播放按钮 -->
      <span id="play-button" class="play" @click="playOrPauseEvent"></span>

      <!-- 播放条 -->
      <div id="play-bar">
        <ul id="ul-ele" v-show="timeArr.length != 0">
          <li v-for="(time, i) in timeArr1" :key="'time' + i" id="i">
            <span class="scale-value">{{ time }}</span>
            <span class="cirlceDot"></span>
            <span class="max-scale-value" v-show="i + 2 == timeArr.length">{{
              timeArr[timeArr.length - 1]
            }}</span>
            <span class="lastDot" v-show="i + 2 == timeArr.length"></span>
          </li>
        </ul>
        <ul v-show="timeArr.length == 0">
          <li v-for="m in 6" :key="'timeline' + m">
            <span class="scale-value"></span>
            <span class="cirlceDot"></span>
            <span class="lastDot" v-show="m == 6"></span>
          </li>
        </ul>
        <div id="progress-bar"></div>
        <span id="start-trangel"></span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  GMTToTimeStr,
  getMonthBetween,
  getDiffDate,
  getHoursBetween,
} from "assets/js/Time";

export default {
  data() {
    return {
      time: "",
      stepUnit: "年",
      formatType: "yyyy",
      timeType: "yearrange",
      // 是否播放
      isPlay: false,
      // 时间轴的初始状态
      isOrigin: true,
      timeArr: [],
      timeArr1: [],
      // 设置禁用时间
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      // 游标默认左偏移量
      defaultOffset: 7,
    };
  },
  methods: {
    // 步长选择改变
    stepUnitChangeEvent(unit) {
      this.time = "";

      switch (unit) {
        case "年":
          this.formatType = "yyyy";
          this.timeType = "range";
          break;
        case "月":
          this.formatType = "yyyy-MM";
          this.timeType = "monthrange";
          break;
        case "日":
          this.formatType = "yyyy-MM-dd";
          this.timeType = "daterange";
          break;
        case "时":
          this.formatType = "yyyy-MM-dd HH时";
          this.timeType = "datetimerange";
          break;
      }
    },

    // 生成播放轴
    createPlayBar() {
      let notScroll = this.timeArr1.length < 6;
      let totalWidth = notScroll ? this.timeArr1.length * 100 : 600;
      let rightOffset = notScroll ? `${(6 - this.timeArr1.length) * 100}px` : 0;

      $("#progress-bar").css({
        width: `${
          totalWidth - $("#start-trangel")[0].offsetLeft - this.defaultOffset
        }px`,
        right: rightOffset,
      });

      this.controlTheDisplayOfTimeLineSegments();
    },

    // 控制时间区段的显示与隐藏
    controlTheDisplayOfTimeLineSegments() {
      let ulEle = document.getElementById("ul-ele");
      let liEles = ulEle.children;

      // 游标
      let startTrangel = document.getElementById("start-trangel");

      for (let i = 0; i < liEles.length; i++) {
        // 获取ulEle的滚动次数
        let times = (startTrangel.flag = Math.abs(ulEle.offsetLeft) / 600);

        let isShow = i - 6 * times >= 0 && i - 6 * times < 6;
        liEles[i].style.visibility = isShow ? "visible" : "hidden";
      }
    },

    // 选择日期发生变化
    dateChangeAndClearState(timeArr) {
      this.timeArr1 = [];
      this.timeArr = [];

      this.isPlay = false;

      // this.$emit("time", "");

      $("#play-button")[0].className = "play";

      $("#progress-bar").css({ width: 0 });

      let startTrangel = $("#start-trangel")[0];
      startTrangel.timeId && clearInterval(startTrangel.timeId);
      startTrangel.timeId1 && clearTimeout(startTrangel.timeId1);
      startTrangel.style.left = `-${this.defaultOffset}px`;
    },

    // 选择时间合法性校验
    timeLegalityVerfy() {
      this.isOrigin = true;

      if (!this.time) {
        this.$message({
          message: "请先选择要查看的时间",
          type: "warning",
        });
        return false;
      }

      let startTime = GMTToTimeStr(this.time[0]);
      let endTime = GMTToTimeStr(this.time[1]);

      if (startTime - endTime == 0) {
        // this.$emit("time", time);
        return false;
      } else {
        switch (this.timeType) {
          case "monthrange":
            this.timeArr = getMonthBetween(startTime, endTime);
            break;
          case "daterange":
            this.timeArr = getDiffDate(startTime, endTime);
            break;
          case "datetimerange":
            this.timeArr = getHoursBetween(startTime, endTime);
            break;
        }

        this.timeArr1 = this.timeArr.slice(0, this.timeArr.length - 1);

        this.$nextTick(() => {
          this.createPlayBar();
        });
        return true;
      }
    },

    // 播放按钮
    playOrPauseEvent() {
      if (!this.timeLegalityVerfy()) return;

      this.isPlay = !this.isPlay;

      // 播放按钮
      let playEle = $("#play-button")[0];
      playEle.className = this.isPlay ? "pause" : "play";

      // 开始游标
      let startTrangel = $("#start-trangel")[0];

      // 播放轴
      let ulEle = $("#ul-ele")[0];

      // 进度条
      let progressBar = $("#progress-bar")[0];

      if (this.isPlay) {
        // 时间轴不滚动
        let notScroll = this.timeArr1.length < 6;

        //  初始剩余长度
        let overLength = this.timeArr1.length * 100;

        // 标记滚动次数
        startTrangel.flag = 1;

        let flagLength = notScroll ? this.timeArr1.length * 100 : 600;

        startTrangel.timeId = setInterval(() => {
          // 根据时间轴的偏移量来获取当前索引
          let totalOffset =
            startTrangel.offsetLeft + this.defaultOffset - ulEle.offsetLeft;
          let currentIndex = 0;
          if (totalOffset % 100 == 0) {
            currentIndex = totalOffset / 100;

            // this.$emit("time", this.timeArr1[currentIndex]);
          }

          if (flagLength - this.defaultOffset - startTrangel.offsetLeft <= 2) {
            overLength =
              this.timeArr1.length * 100 - Math.abs(ulEle.offsetLeft) - 600;

            if (overLength >= 600) {
              $("#ul-ele").css({ left: `${ulEle.offsetLeft - 600}px` });
              $("#start-trangel").css({ left: `-${this.defaultOffset}px` });
              $("#progress-bar").css({ width: "100%" });

              this.controlTheDisplayOfTimeLineSegments();
              startTrangel.flag += 1;
            } else if (overLength >= 100 && overLength < 600) {
              $("#ul-ele").css({ left: `${ulEle.offsetLeft - overLength}px` });
              $("#start-trangel").css({
                left: `${600 - this.defaultOffset - overLength}px`,
              });
              $("#progress-bar").css({ width: `${overLength}px` });

              this.controlTheDisplayOfTimeLineSegments();
            } else {
              // this.$emit("time", this.timeArr[this.timeArr.length - 1]);

              clearInterval(startTrangel.timeId);

              // 一秒后回归至初始状态
              startTrangel.timeId1 = setTimeout(() => {
                // this.$emit("time", "");

                $("#ul-ele").css({ left: 0 });
                $("#start-trangel").css({ left: `-${this.defaultOffset}px` });
                $("#progress-bar").css({ width: `${flagLength}px` });

                this.controlTheDisplayOfTimeLineSegments();
                playEle.className = "play";
                this.isPlay = false;
              }, 2000);
            }
          } else {
            startTrangel.style.left = `${startTrangel.offsetLeft + 2}px`;
            progressBar.style.width = `${progressBar.offsetWidth - 2}px`;
          }
        }, 100);

        return;
      }

      // 暂停
      startTrangel.flag = -1;
      clearInterval(startTrangel.timeId);
      startTrangel.timeId = null;
    },
  },
};
</script>

<style scoped lang="scss">
.time-line-container {
  width: 1055px;
  height: 110px;
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  border-radius: 10px;
  z-index: 999;
  background: rgba(4, 17, 45, 0.95);
  border: 1px solid #478dfc;
  box-shadow: inset 0 0 6px 2px #478dfc;

  .time-pick {
    width: 320px;
    height: 110px;
    text-align: left;
    padding: 15px 20px;

    strong {
      color: #fff;
      text-align: left;
      margin-right: 10px;
    }

    >>> .el-range-editor--small.el-input__inner {
      width: 280px;
      position: absolute;
      top: 60px;
      left: 20px;
      border: 1px solid #478dfc;
    }

    >>> .el-date-editor .el-range-separator {
      width: 24px;
      padding: 0;
      color: rgb(86, 171, 228);
    }

    >>> .el-icon-date:before {
      color: rgb(86, 171, 228);
    }

    >>> .el-range-editor--small .el-range-input {
      color: #fff;
    }
  }

  .time-line {
    width: 730px;
    height: 110px;
    position: absolute;
    top: 0;
    left: 320px;
    overflow: hidden;

    #play-button {
      width: 28px;
      height: 28px;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      z-index: 1000;
      cursor: pointer;

      &.play {
        background: url(~assets/images/hotMap/play.png) no-repeat center;
      }

      &.pause {
        background: url(~assets/images/hotMap/pause.png) no-repeat center;
      }
    }

    /* 播放条 */
    #play-bar {
      width: 600px;
      height: 40px;
      position: relative;
      white-space: nowrap;
      position: absolute;
      top: 50%;
      left: 70px;
      transform: translateY(-50%);

      ul {
        text-align: left;
        position: relative;

        li {
          width: 100px;
          height: 4px;
          margin-top: 18px;
          background: #0173a6;
          display: inline-block;
          position: relative;

          /* 刻度线 */
          .cirlceDot,
          .lastDot {
            height: 14px;
            width: 14px;
            border-radius: 7px;
            background: url(~assets/images/hotMap/blue_circle.png) center /
              cover no-repeat;
            position: absolute;
            bottom: -5px;
            z-index: 10;
          }

          .cirlceDot {
            left: -4px;
          }

          .lastDot {
            right: -4px;
          }

          /* 刻度值 */
          .scale-value {
            font-size: 12px;
            color: #fff;
            position: absolute;
            left: 0;
            bottom: 20px;
            transform: translateX(-50%);
          }

          .max-scale-value {
            font-size: 12px;
            color: #fff;
            position: absolute;
            right: 0;
            bottom: 20px;
            transform: translateX(50%);
          }
        }
      }

      #progress-bar {
        height: 4px;
        background: #50e3c2;
        position: absolute;
        right: 0;
        top: 18px;
      }

      /* 游标 */
      #start-trangel {
        width: 12px;
        height: 12px;
        position: absolute;
        left: -7px;
        bottom: 0;
        background: url("~assets/images/hotMap/trangel.png");
      }
    }
  }
}
</style>