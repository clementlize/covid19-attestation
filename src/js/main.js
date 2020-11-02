import 'bootstrap/dist/css/bootstrap.min.css'
import '../style.css';

import { warnFacebookBrowserUserIfNecessary } from './facebook-util';
import { homePage } from './pages';

warnFacebookBrowserUserIfNecessary();  // Red banner on top of the page if the user is browsing with fb browser
homePage();  // Main script
