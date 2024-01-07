import Theme, {
  getCustomMDXComponent as originalGetCustomMDXComponent,
} from "rspress/theme";
import { H1, H2, H3 } from "./docComponents/title";
import { Hr } from "./docComponents/hr";

export default {
  ...Theme,
};

export function getCustomMDXComponent() {
  return {
    ...originalGetCustomMDXComponent(),
    h1: H1,
    h2: H2,
    h3: H3,
    hr: Hr,
  };
}

export * from "rspress/theme";
