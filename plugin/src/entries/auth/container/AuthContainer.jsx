import createContainer from 'zn-container';
import Auth from '../component/Auth';

import * as actions from '../action';

export default createContainer("auth.main", actions, {}).bind(Auth);