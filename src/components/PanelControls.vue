<template>
  <div id="controls-container" class="left">
    <div class="controls">
      <h4 class="title">Controls:</h4>
      <div class="button-array">
        <div v-for="digit in 9" :key="digit" class="button-spacing">
          <el-button
            class="button"
            type="primary"
            :data-cy="digit"
            @click="simKeyDown(digit)"
            >{{ digit }}</el-button
          >
        </div>
        <div class="button-bottom">
          <el-button
            class="button"
            data-cy="Delete"
            @click="simKeyDown('Delete')"
            >Delete</el-button
          >
          <el-button class="button">[NYI]Color</el-button>
        </div>
      </div>
      <div class="toggles" :style="toggleStyle">
        <el-button
          v-for="toggle in toggles"
          :key="toggle"
          :type="currentToggle === toggle ? 'primary' : 'default'"
          :data-cy="toggle"
          @click="handleToggle(toggle)"
          >{{ toggle }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Controls",
  data() {
    return {
      toggles: ["Normal", "Top", "Mid"],
      currentToggle: "Normal",
      lastToggle: "Normal"
    };
  },
  computed: {
    toggleStyle: () => {
      return {
        flexDirection: 'row'
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener("keydown", this.handleKeyDown, false);
      window.addEventListener("keyup", this.handleKeyUp, false);
    });
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleKeyDown, false);
    window.removeEventListener("keydown", this.handleKeyUp, false);
  },
  methods: {
    handleToggle(t) {
      if (t === "down") {
        this.lastToggle = JSON.parse(JSON.stringify(this.currentToggle));
      } else if (t === "up") {
        this.currentToggle = JSON.parse(JSON.stringify(this.lastToggle));
      } else {
        this.currentToggle = t;
      }
    },
    incrementToggle() {
      const index = this.toggles.indexOf(this.currentToggle);
      const newIndex = (index + 1) % this.toggles.length;
      this.currentToggle = this.toggles[newIndex];
      this.lastToggle = this.toggles[newIndex];
    },
    handleKeyDown(e) {
      switch (e.code) {
        case "ShiftLeft":
        case "ShiftRight":
          this.handleToggle("down");
          this.currentToggle = "Top";
          break;
        case "ControlLeft":
        case "ControlRight":
          this.handleToggle("down");
          this.currentToggle = "Mid";
          break;
        case "Space":
          this.incrementToggle();
          e.preventDefault();
          break;
        default:
          return;
      }
    },
    handleKeyUp(e) {
      switch (e.code) {
        case "ShiftLeft":
        case "ShiftRight":
        case "ControlLeft":
        case "ControlRigth":
          this.handleToggle("up");
          break;
        default:
          return;
      }
    },
    simKeyDown(digit) {
      const keyCode = isNaN(digit) ? digit : "Digit" + digit;
      const keyTable = {
        Backspace: 8,
        Delete: 46,
        0: 48,
        1: 49,
        2: 50,
        3: 51,
        4: 52,
        5: 53,
        6: 54,
        7: 55,
        8: 56,
        9: 57
      };
      const KeyboardEventInit = {
        key: digit, // type: DOMString, key
        code: keyCode, // type: DOMString, code
        location: 0, // type: unsigned long, location
        ctrlKey: this.currentToggle === "Mid",
        altKey: false,
        shiftKey: this.currentToggle === "Top",
        metaKey: false,
        repeat: false,
        isComposing: false,
        charCode: 0, // type: unsigned long, charCode
        keyCode: keyTable[digit], // type: unsigned long, keyCode,
        which: keyTable[digit]
      };
      const kbEvent = new KeyboardEvent("keydown", KeyboardEventInit);
      window.dispatchEvent(kbEvent);
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
