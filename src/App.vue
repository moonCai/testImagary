<template>
  <div id="app">
    <header-component :show="showHeader"></header-component>
    <router-view />
  </div>
</template>

<script>
import HeaderComponent from "components/common/Header";

export default {
  name: "App",
  data() {
    return {
      showHeader: false,
    };
  },
  components: {
    HeaderComponent,
  },
  updated() {
    this.showHeader = this.$route.meta.login_require;
  },
};
</script>

<style>
@import url("./assets/css/base.css");
@import url("./assets/css/scrollBar.css");
@import url("./assets/css/dropDown.css");
@import url("./assets/css/checkbox.css");
@import url("./assets/css/datePicker.css");
@import url("./assets/css/table.css");
@import url("./assets/css/form.css");

html,
body {
  height: 100%;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  background: rgba(4,17,45,0.95);
  min-width: 1200px;
  min-height: 700px;
  position: relative;
}
</style>

