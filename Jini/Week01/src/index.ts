type StudyMember = {
  id: number;
  name: string;
  role: "leader" | "member";
  githubId?: string;
};

const studyMembers: StudyMember[] = [
  {
    id: 1,
    name: "광수",
    role: "leader",
    githubId: "gwangsoo",
  },
  {
    id: 2,
    name: "지수",
    role: "member",
  },
];

function getMemberMessage(id: number): string {
  const member = studyMembers.find(
    (member) => member.id === id
  );

  if (!member) {
    return "회원을 찾을 수 없습니다.";
  }

  const githubId = member.githubId ?? "등록되지 않음";

  return `${member.name} / 역할: ${member.role} / GitHub: ${githubId}`;
}

console.log(getMemberMessage(1));
console.log(getMemberMessage(2));
console.log(getMemberMessage(999));