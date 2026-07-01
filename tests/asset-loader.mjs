import { URL } from "node:url";

const assetPattern = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i;
const extensionlessRelativePattern = /^\.{1,2}\//;

export async function resolve(specifier, context, nextResolve) {
  if (assetPattern.test(specifier)) {
    return {
      shortCircuit: true,
      url: new URL(specifier, context.parentURL).href,
    };
  }

  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    if (
      error?.code === "ERR_MODULE_NOT_FOUND" &&
      extensionlessRelativePattern.test(specifier)
    ) {
      return nextResolve(`${specifier}.js`, context);
    }

    throw error;
  }
}

export async function load(url, context, nextLoad) {
  if (assetPattern.test(url)) {
    const src = new URL(url).pathname;

    return {
      format: "module",
      shortCircuit: true,
      source: `export default ${JSON.stringify({ src })};`,
    };
  }

  return nextLoad(url, context);
}
