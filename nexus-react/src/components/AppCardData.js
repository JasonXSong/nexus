export const fetchAppCards = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/knowledge/?page_num=0&page_size=10');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching app cards:', error);
      return []; // 返回空数组作为后备
    }
  };