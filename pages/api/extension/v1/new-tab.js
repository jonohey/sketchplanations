// V1 endpoint for production extension - uses shared handler
import createNewTabHandler from "../_shared/new-tab-handler";

export default createNewTabHandler({ apiVersion: "v1" });
