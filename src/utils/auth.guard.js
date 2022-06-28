import { isAuthGuardActive } from "../constants/config";
import { setCurrentUser, getCurrentUser, addCategoryTitle } from ".";
export default (to, from, next) => {
  console.log("frommmmmmmm", from, from.params.id);
  addCategoryTitle(from.params.id);
  // this.$store.dispatch("blockCategoryId", from.params.id);
  if (to.matched.some(record => record.meta.loginRequired)) {
    if (isAuthGuardActive) {
      const user = getCurrentUser();
      if (user) {
        const roleArrayHierarchic = to.matched
          .filter(x => x.meta.roles)
          .map(x => x.meta.roles);
        if (roleArrayHierarchic.every(x => x.includes(user.role[0]))) {
          next();
        } else {
          next("/unauthorized");
        }
      } else {
        setCurrentUser(null);
        next("/user/login");
      }
    } else {
      next();
    }
  } else {
    next();
  }
};
