import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

/**
 * 게시된 프로젝트 목록을 표시 순서(sort_order)대로 불러오는 훅.
 *
 * @returns {{ projects: Array, isLoading: boolean, error: string }}
 */
export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCancelled = false;
    supabase
      .from('projects')
      .select('id, title, description, tech_stack, detail_url, github_url, thumbnail_url')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .then(({ data, error: loadError }) => {
        if (isCancelled) {
          return;
        }
        if (loadError) {
          setError('프로젝트를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
        } else {
          setProjects(data);
        }
        setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  return { projects, isLoading, error };
}
