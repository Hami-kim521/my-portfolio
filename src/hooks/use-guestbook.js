import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

/** 작성자 이름은 비공개 컬럼이라 공개 조회 시 일부러 제외합니다. */
const PUBLIC_COLUMNS = 'id, message, rating, created_at';

/** 방명록 목록을 최신순으로 조회합니다. */
const fetchEntries = () =>
  supabase.from('guestbook').select(PUBLIC_COLUMNS).order('created_at', { ascending: false });

/**
 * 방명록 목록(최신순)을 불러오고, 새 글을 남기는 훅.
 *
 * @returns {{ entries: Array, isLoading: boolean, error: string, addEntry: function }}
 */
export default function useGuestbook() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const applyResult = ({ data, error: loadError }) => {
    if (loadError) {
      setError('방명록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
    } else {
      setError('');
      setEntries(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let isCancelled = false;
    fetchEntries().then((result) => {
      if (!isCancelled) {
        applyResult(result);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  /**
   * @param {{ authorName: string, message: string, rating: number }} entry
   * @returns {Promise<boolean>} 저장 성공 여부
   */
  const addEntry = async ({ authorName, message, rating }) => {
    const { error: insertError } = await supabase
      .from('guestbook')
      .insert({ author_name: authorName, message, rating });

    if (insertError) {
      return false;
    }
    applyResult(await fetchEntries());
    return true;
  };

  return { entries, isLoading, error, addEntry };
}
