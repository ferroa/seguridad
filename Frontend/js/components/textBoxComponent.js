export function input(type, placeholder, options = {}) {
  const {role = "user", extraClasses = ""} = options;
  const input = document.createElement('input');
  input.className = "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${extraClasses}";
  input.type = type;
  input.placeholder = placeholder;
  input.disabled;

  if (role === "admin") {
    input.classList.add("");
  } else if(role === "superadmin"){
    input.classList.add("");
  }
  
  return input;
}
