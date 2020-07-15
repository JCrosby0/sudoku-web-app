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
  Slider,
  Select,
  Option,
  Tooltip,
  Input,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Tabs,
  TabPane,
  Dialog,
  Table,
  TableColumn
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
Vue.use(Select);
Vue.use(Option);
Vue.use(Tooltip);
Vue.use(Input);
Vue.use(Menu),
Vue.use(Submenu),
Vue.use(MenuItem),
Vue.use(MenuItemGroup),
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Dialog);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
