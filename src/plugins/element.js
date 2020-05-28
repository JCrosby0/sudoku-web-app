import Vue from "vue";
import {
  Button,
  Header,
  Drawer,
  Icon,
  Form,
  Checkbox,
  CheckboxGroup
} from "element-ui";
import lang from "element-ui/lib/locale/lang/en";
import locale from "element-ui/lib/locale";

locale.use(lang);

Vue.use(Button);
Vue.use(Header);
Vue.use(Drawer);
Vue.use(Icon);
Vue.use(Form);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
