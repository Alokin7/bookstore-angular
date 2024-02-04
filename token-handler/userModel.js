class User {
  constructor(email, password, firstName, lastName, roleId) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.roleId = roleId;
  }

  setId() {
    this.id = Date.now();
  }

  async save() {
    this.setId();

    const rawResponse = await fetch("http://localhost:7777/users", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: this.id, 
        email: this.email, 
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        roleId: this.roleId
      })
    });

    const data = await rawResponse.json();
  }

  async findOne(email) {
    const rawResponse = await fetch(`http://localhost:7777/users?email_like=${email}`);
    const data = await rawResponse.json();
    
    if (data.length > 0) {
      return data[0]
    } else {
      return null
    }
  }
};

module.exports = User;