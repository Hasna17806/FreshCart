import './globals.css';
export const metadata = { title: 'FreshCart', description: 'Neighbourhood grocery shop' };
export default function RootLayout({ children }) {
  return (<html lang="en"><body>{children}</body></html>);
}
