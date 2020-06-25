<template>
  <div id="controls-container" class="left">
    <div class="controls">
      <h4 class="title">Controls:</h4>
      <div class="button-array">
        <div v-for="digit in 9" :key="digit" class="button-spacing">
          <el-button
            class="button"
            type="primary"
            @click="simulateKeyDown(digit)"
            >{{ digit }}</el-button
          >
        </div>
        <div class="button-bottom">
          <el-button class="button">Delete</el-button>
          <el-button class="button">Color</el-button>
        </div>
      </div>
      <el-button-group class="toggles">
        <el-button
          v-for="toggle in toggles"
          :key="toggle"
          :type="currentToggle === toggle ? 'primary' : 'default'"
          @click="handleToggle(toggle)"
          >{{ toggle }}</el-button
        >
      </el-button-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "Controls",
  data() {
    return {
      toggles: ["Normal", "Top", "Mid"],
      currentToggle: "Normal"
    };
  },
  methods: {
    handleToggle(t) {
      this.currentToggle = t;
    },
    simulateKeyDown(digit) {
      console.log("digit: ", digit);
      const keyCode = "Digit" + digit;
      console.log("keyCode: ", keyCode);
      var keyboardEvent = document.createEvent("KeyboardEvent");
      var initMethod =
        typeof keyboardEvent.initKeyboardEvent !== "undefined"
          ? "initKeyboardEvent"
          : "initKeyEvent";

      keyboardEvent[initMethod](
        "keydown", // event type: keydown, keyup, keypress
        true, // bubbles
        true, // cancelable
        window, // view: should be window
        false, // ctrlKey
        false, // altKey
        false, // shiftKey
        false, // metaKey
        keyCode, // keyCode: unsigned long - the virtual key code, else 0
        0 // charCode: unsigned long - the Unicode character associated with the depressed key, else 0
      );
      document.dispatchEvent(keyboardEvent);
    }
  }
};
</script>

<style>
.title {
  text-align: left;
}
#controls-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
#controls-container .rules,
#controls-container .controls {
  flex: 1 1 50%;
  border: 1px solid #eee;
  padding: 0 12px;
  margin: 12px;
}
.left {
  text-align: left;
}
li {
  list-style: "-";
}
ul {
  padding-left: 0;
}
.button-array {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.button-spacing {
  flex: 1 1 auto;
  text-align: center;
  padding: 12px;
}
.button-bottom {
  flex: 1 1 75%;
  text-align: center;
  padding: 12px;
}
.toggles {
  padding-top: 12px;
}
.controls {
  text-align: center;
}
</style>
