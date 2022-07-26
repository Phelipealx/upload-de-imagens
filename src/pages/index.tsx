import { Box, Button } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { AxiosResponse } from 'axios';
import { CardList } from '../components/CardList';
import { Error } from '../components/Error';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { api } from '../services/api';
import { ImagesQueryResponse } from './api/images';

export default function Home(): JSX.Element {
  const getImages = ({
    pageParam = null,
  }): Promise<AxiosResponse<ImagesQueryResponse>> => {
    return api.get('/api/images', {
      params: {
        after: pageParam,
      },
    });
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', getImages, {
    getNextPageParam: lastPage => {
      return lastPage.data.after;
    },
  });

  const formattedData = useMemo(() => {
    const formatted = data?.pages.flatMap(item => item.data.data);
    return formatted as any;
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {hasNextPage && (
          <Button onClick={() => fetchNextPage()}>
            {!isFetchingNextPage ? 'Carregar mais' : 'Carregando...'}
          </Button>
        )}
      </Box>
    </>
  );
}
