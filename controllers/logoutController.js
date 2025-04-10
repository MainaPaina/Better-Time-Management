const userId = req.session?.user?.id;
      if (!userId) {
        return res.redirect('/login');
      }

const fsPromises = require("fs").promises;
const path = require("path");


const handleLogout = async (req, res) =>
{
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);

    if(!foundUser)
    {
        res.clearCookie("jwt", {httpOnly: true, maxAge: 0})
        return res.sendStatus(204);
    }

    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken : ""};
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile
    (
        path.join(__dirname, "..", "model", "users.json"),
        JSON.stringify(usersDB.users)
    );

    res.clearCookie("jwt", {httpOnly: true, maxAge: 0});
    res.sendStatus(204);

};

module.exports = {handleLogout};