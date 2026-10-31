const Footer = () => {
  return (
    <footer className="border-t px-4 py-4 text-center text-xs text-muted-foreground sm:text-left">
      © {new Date().getFullYear()} ResQ. All rights reserved.
    </footer>
  );
};

export default Footer;
