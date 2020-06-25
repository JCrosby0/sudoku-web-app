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
  FormItem,
  Loading,
  Message,
  MessageBox,
  Notification,
  Slider
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
Vue.use(Slider);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
