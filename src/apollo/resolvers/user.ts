const login = async (parent: any, args: any, { payload }: any) => {
  return { id: payload.id, email: payload.email };
};

export default login;
