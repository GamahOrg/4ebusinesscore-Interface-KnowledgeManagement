import Swal from "sweetalert2";
import { SystemLang } from "@4eplatform/shared/assets/Lang";

let timer: ReturnType<typeof setTimeout>;
const AUTO_LOGOUT_FLAG = "auto_logout_handled";

const autoLogout = (timeoutInSeconds: number) => {
  clearTimeout(timer);

  timer = setTimeout(() => {
    const isLangArabic = SystemLang() === "ar";
    const alreadyHandled = localStorage.getItem(AUTO_LOGOUT_FLAG) === "true";

    if (!alreadyHandled) {
      localStorage.setItem(AUTO_LOGOUT_FLAG, "true");

      Swal.fire({
        title: isLangArabic
          ? "لقد انتهت فتره صلاحيه الدخول"
          : "Session Expired",
        text: isLangArabic ? "من فضلك أعد تسجبل الدخول" : "Please Relogin",
        icon: "warning",
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      // Clear user data
      localStorage.setItem("user", "");
      localStorage.removeItem("userId");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      localStorage.removeItem("changedTemporary");
      localStorage.removeItem("bg_theme");
      localStorage.removeItem("temporaryWebsiteCover");
      localStorage.removeItem("websiteCover");
      localStorage.removeItem("Theme");
      localStorage.removeItem("selectedLang");
      localStorage.removeItem("i18nConfig");
      localStorage.removeItem("i18nextLng");

      // Redirect after delay, only if not already on login page
      setTimeout(() => {
        const isDev = (window as any)._env_?.NODE_ENV !== "production";
        const loginUrl = isDev
          ? "/knowledgemanagement/auth/login"
          : (window as any)._env_?.REACT_APP_Base_Url ?? "/";

        if (!window.location.href.includes("auth/login")) {
          window.location.href = loginUrl;
        }
      }, 2000);
    }
  }, timeoutInSeconds * 1000);
};

export default autoLogout;
