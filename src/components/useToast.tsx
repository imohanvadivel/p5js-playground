const useToast = (msg: string, time?: number) => {
  let toast = document.querySelector(".toast");
  toast.classList.add("active");
  toast.querySelector(".msg").innerHTML = msg;
  let delay = time || 2500;
  setTimeout(() => toast.classList.remove("active"), delay);
};

export default useToast;
