import { Container } from "@/shared/components/container";

export async function generateMetadata() {
  return {
    title: 'Главная страница',
    description: 'Главная страница сайта томато вкусная еда',
  }
}

export default function Home() {
  return (
    <Container>
    </Container>
  );
}