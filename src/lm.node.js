import lmfit from './build/lmfit.js';
import lm from './lm.js';

const lm_ = lmfit().then(lmfit => lm(lmfit));

export default lm_;
