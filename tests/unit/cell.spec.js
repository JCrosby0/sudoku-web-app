// Good for standalone components.
// Perhaps if the cells weren't reading from parent state...

// Import the `mount()` method from the test utils
// and the component you want to test
import { mount } from "@vue/test-utils";
import App from "../../src/main.js";
// import Grid from '../../src/components/Grid.vue'
// import Cell from '../../src/components/Cell.vue'

describe("Cell", () => {
  test("is a Vue instance", () => {
    // Now mount the component and you have the wrapper
    const wrapper = mount(App);
    // const wrapper = mount(Cell, {
    //   propsData: {
    //     rowId: 0,
    //     cellId: 0
    //   }
    // });
    expect(wrapper.isVueInstance()).toBeTruthy();
    // You can access the actual Vue instance via `wrapper.vm`
    // const vm = wrapper.vm;

    // To inspect the wrapper deeper just log it to the console
    // and your adventure with the Vue Test Utils begins
    console.log(wrapper);

    it("renders the correct markup", () => {
      expect(wrapper.html()).toContain('<span class="count">0</span>');
    });

    // it's also easy to check for the existence of elements
    it("has a button", () => {
      expect(wrapper.contains("button")).toBe(true);
    });
  });
});
