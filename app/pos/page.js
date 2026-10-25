import Nav from '@/components/Nav';
import Pos from '@/components/Pos';
import { pool } from '@/lib/db';
import { requireUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function PosPage() {
  const user = await requireUser();
  const { rows } = await pool.query('SELECT id,name,price::float AS price,stock FROM products ORDER BY name');
  return (<><Nav user={user} /><div className="wrap"><h1>POS billing</h1><Pos products={rows} /></div></>);
}
