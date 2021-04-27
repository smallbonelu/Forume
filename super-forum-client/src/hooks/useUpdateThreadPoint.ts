import { gql, useMutation } from "@apollo/client";

const UpdateThreadPoint = gql`
  mutation UpdateThreadPoint($threadId: ID!, $increment: Boolean!) {
    updateThreadPoint(threadId: $threadId, increment: $increment)
  }
`;

const useUpdateThreadPoint = (
  refreshThread?: () => void,
  threadId?: string
) => {
  const [execUpdateThreadPoint] = useMutation(UpdateThreadPoint);
  const onClickIncThreadPoint = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.preventDefault();
    const { data: updateThreadPointResult } = await execUpdateThreadPoint({
      variables: {
        threadId,
        increment: true,
      },
    });
    if (updateThreadPointResult.updateThreadPoint.startsWith("Fail")) {
      return;
    }
    refreshThread && refreshThread();
  };

  const onClickDecThreadPoint = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.preventDefault();
    const { data: updateThreadPointResult } = await execUpdateThreadPoint({
      variables: {
        threadId,
        increment: false,
      },
    });
    if (updateThreadPointResult.updateThreadPoint.startsWith("Fail")) {
      return;
    }
    refreshThread && refreshThread();
  };

  return { onClickDecThreadPoint, onClickIncThreadPoint };
};

export default useUpdateThreadPoint;
