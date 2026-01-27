export const knowledgeLoadRoutes = async () => {
  let components = [];
  try {
    let { AppShared } = await import("@4eplatform/shared");
    components.push(AppShared);
  } catch (error) {
    console.error("Error loading shared:", error);
  }

  // try {
  //   let { userProfile } = await import("@4eplatform/user-profile");
  //   components.push(userProfile);
  // } catch (error) {
  //   console.error("Error loading user-profile:", error);
  // }

  try {
    let { Knowledge } = await import(
      "@4eplatform/knowledge"
    );
    components.push(Knowledge);
  } catch (error) {
    console.error("Error loading knowledge:", error);
  }

  try {
    let { Connect } = await import("@4eplatform/connect");
    components.push(Connect);
  } catch (error) {
    console.error("Error loading connect:", error);
  }

  return components;
};
