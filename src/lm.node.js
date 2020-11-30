import lmfit from './build/lmfit';
import lm from './lm';

const lm_ = lmfit().then(lmfit => lm(lmfit));

export default lm_;
