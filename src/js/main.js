import 'bootstrap/dist/css/bootstrap.min.css'
import '../style.css';

import { warnFacebookBrowserUserIfNecessary } from './facebook-util';
import { homePage } from './pages';

warnFacebookBrowserUserIfNecessary();
homePage();
