/**
 * GET /
 * Homepage
 */
exports.homepage = async (req, res) => {
  const locals = {
    title: "Home Page",
    description: "Home Page Description",
  };
  try {
    res.render("index", locals);
  } catch (error) {
    console.log(error);
  }
};
