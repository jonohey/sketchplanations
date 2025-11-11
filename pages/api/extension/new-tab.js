// Legacy endpoint for beta testers - uses shared handler
import createNewTabHandler from "./_shared/new-tab-handler";

export default createNewTabHandler({ apiVersion: "legacy" });
