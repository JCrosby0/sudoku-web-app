import Vue from "vue";
import {
  Button,
  ButtonGroup,
  Container,
  Header,
  Main,
  Aside,
  Drawer,
  Checkbox,
  CheckboxGroup,
  Form,
  FormItem
} from "element-ui";
import lang from "element-ui/lib/locale/lang/en";
import locale from "element-ui/lib/locale";

locale.use(lang);

Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Container);
Vue.use(Header);
Vue.use(Main);
Vue.use(Aside);
Vue.use(Drawer);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Form);
Vue.use(FormItem);
