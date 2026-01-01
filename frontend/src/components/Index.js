import NavBar from "./NavBar";
import QueueList from "./QueueList";
import BusinessPanel from "./BusinessPanel";
import JoinQueueForm from "./JoinQueueForm";
import Footer from "./Footer";
import SearchBar from "./SearchBar";
import ErrorMessage from "./ErrorMessage";
import { APP_NAME, APP_VERSION } from "./Version";

const components = { 
  NavBar, 
  QueueList, 
  BusinessPanel, 
  JoinQueueForm,
  Footer,
  SearchBar,
  ErrorMessage,
  APP_NAME, // needed for version control btw
  APP_VERSION,

};

export default components;