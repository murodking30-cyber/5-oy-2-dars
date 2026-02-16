const { v4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { read_file, write_file } = require("../api/file-system");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const users = read_file("register.json");

    // 1 email = 1 marta
    if (users.find(u => u.email === email))
      return res.status(409).json({ message: "Email already used" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
      id: v4(),
      username,
      email,
      password: hashedPassword,
      role: "user"
    };

    users.push(newUser);
    write_file("register.json", users);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: "Registered successfully", user: userWithoutPassword });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const users = read_file("register.json");
    const user = users.find(u => u.email === email);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Wrong password" });

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };
