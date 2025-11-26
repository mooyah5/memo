const { data, isError, isLoading } = useQuery({
  queryKey: ['post', id],
  queryFn: () => fetch(`/api/posts/${id}`).then(res => res.json()),
  retry: 3,
  retryDelay: attempt => Math.min(1000 * 2 ** attempt, 3000)  // 지수 백오프
})