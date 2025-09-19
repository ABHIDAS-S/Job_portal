import { fetchDataFromApi } from "@/api/fetchDataFromApi";
import { useEffect, useState } from "react";
import { useSession } from "@clerk/clerk-react";

const useFetch = (url, params) => {
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const { session } = useSession();

  

  useEffect(() => {
    const fetchData = async () => {
      if (!url || !session) {
        return;
      }
      setLoading(true);
      setData(null);
      setError(null);

      try {
        const token = await session.getToken();
        const data = await fetchDataFromApi(url, params, token);
        setData(data?.data);
      } catch (err) {
        setError("Something went wrong");
        setError(err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, refresh, session]);

  const refreshHook = () => {
    setRefresh(!refresh);
  };

  return { data, loading, error, refreshHook,setLoading };
};

export default useFetch;
