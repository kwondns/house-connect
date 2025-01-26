import { useQueries, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import HouseDetailTemplate, {
  HouseData,
} from '@/components/templates/HouseDetailTemplate';
import { useHouseBookMark, houseDetailQuery } from '@/hooks/useHouseDetail';
import { UserAtom } from '@/stores/auth.store';
import CommentTemplate from '@/components/templates/CommentTemplate';
import { houseCommentQuery } from '@/hooks/useCommentReply';
import { CommentType } from '@/types/houseComment.type';

function HouseDetail() {
  const { houseId } = useParams();
  const user = useRecoilValue(UserAtom);
  const data = useQueries({
    queries: [houseDetailQuery(houseId), useHouseBookMark(user, houseId)],
  });
  const { data: comments } = useQuery(houseCommentQuery(houseId));

  const [houseDetail, houseBookmark] = data;
  const { data: houseData } = houseDetail;
  const { data: bookmark } = houseBookmark;

  return (
    <>
      <HouseDetailTemplate
        houseData={houseData?.data as unknown as HouseData}
        bookmark={bookmark?.data as unknown as boolean}
        houseId={houseId as string}
      />
      <CommentTemplate
        comments={comments?.data as unknown as CommentType[]}
        commentsCount={comments?.count as unknown as string}
      />
    </>
  );
}

export default HouseDetail;
