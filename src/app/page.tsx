"use client"
import { DataTable } from '@/components/DataTable/DataTable';
import { taskCols } from '@/components/DataTable/columns/task.cols';
import { useEffect, useState } from 'react';



export default function Home() {
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/notion`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setResult(result);
      } catch (err) {
        console.log(err)
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='container mx-auto w-11/12'>
      <p>List of tasks.</p>
      <DataTable columns={taskCols} data={result}>
      </DataTable>
    </div>
  );
}
