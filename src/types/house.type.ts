import { z } from 'zod';

export const HouseForm = z.object({
  house_img: z.array(z.string()),
  representative_img: z.string({ required_error: '대표사진을 선택해주세요.' }),
  post_title: z
    .string({ required_error: '글 제목을 입력해주세요.' })
    .min(2, { message: '제목은 2글자 이상이어야 합니다.' }),
  region: z.string({ required_error: '주거지의 지역을 입력해주세요.' }),
  district: z.string({ required_error: '주거지의 시,구를 입력해주세요.' }),
  /**
   * ### 찾는 집 유형
   * - 0: 원룸/오피스텔
   * - 1: 빌라/연립
   * - 2: 아파트
   * - 3: 단독주택
   * - undefined: 지정되지 않음(초기값)
   */
  house_type: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  /**
   * ### 집 대여 유형
   * - 0: 상관없음
   * - 1: 월세
   * - 2: 전세
   * - 3: 반 전세
   * - undefined: 지정되지 않음(초기값)
   */
  rental_type: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
  ]),
  house_size: z.number({
    required_error: '공유 주거의 넓이를 평 단위로 입력해주세요.',
  }),
  room_num: z.number(),
  /**
   * ### 층 옵션
   * - 0: 지하
   * - 1: 반지하
   * - 2: 지상
   * - undefined: 지정되지 않음(초기값)
   */
  floor: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
  deposit_price: z.number({
    required_error: '보증금을 만원 단위로 입력해주세요.',
  }),
  monthly_price: z.number({
    required_error: '월세를 만원 단위로 입력해주세요.',
  }),
  manage_price: z.number({
    required_error: '관리비를 만원 단위로 입력해주세요.',
  }),
  house_appeal: z
    .array(z.string(), { required_error: '우리 집의 매력을 작성해주세요.' })
    .min(1, { message: '1개 이상의 특징을 작성해주세요.' }),
  term: z
    .tuple(
      [
        z
          .number()
          .min(0, { message: '최소값은 0개월 입니다.' })
          .max(25, { message: '최대값은 2년 이상 입니다.' }),
        z
          .number()
          .min(0, { message: '최소값은 0개월 입니다.' })
          .max(25, { message: '최대값은 2년 이상 입니다.' }),
      ],
      { required_error: '최소 기간 및 최대 기간을 선택해주세요.' },
    )
    .refine(data => data[0] <= data[1], {
      message: '최소 기간이 최대 기간보다 클 수 없습니다.',
    }),
  describe: z.string(),
  prefer_age: z.tuple([z.number(), z.number()], {
    required_error: '원하시는 룸메이트의 연력을 선택해주세요.',
  }),
  /**
   * ### 저장 유형
   * - 0: 임시 저장(default)
   * - 1: 완전 저장
   */
  temporary: z.union([z.literal(0), z.literal(1)]).default(0),
  bookmark: z.number(),
  user_id: z.string(),
});

export type HouseFormType = z.infer<typeof HouseForm>;
const HouseCard = HouseForm.pick({
  representative_img: true,
  house_type: true,
  rental_type: true,
  deposit_price: true,
  monthly_price: true,
  house_appeal: true,
  region: true,
  district: true,
  term: true,
}).required();

export type HouseCardType = z.infer<typeof HouseCard> & { id: string };
