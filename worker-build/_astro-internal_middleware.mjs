globalThis.process ??= {}; globalThis.process.env ??= {};
import './chunks/astro-designed-error-pages_JZ1tVOrG.mjs';
import './chunks/astro/server_Bd8-x6y9.mjs';
import { s as sequence } from './chunks/index_BLWP16-W.mjs';

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env
    };
  }
  return next();
};

const onRequest = sequence(
	onRequest$1,


);

export { onRequest };
