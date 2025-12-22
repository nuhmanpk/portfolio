export function getDynamicAge(): number {
    const birthdateStr = process.env.BIRTHDATE;
    if (birthdateStr) {
      const birthDate = new Date(birthdateStr);
      const now = new Date();
      let age = now.getFullYear() - birthDate.getFullYear();
      const m = now.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
    return new Date().getFullYear() - 2000;
  }