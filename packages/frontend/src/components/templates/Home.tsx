import React from "react";

import { Container } from "../atoms/Container";
import { Main } from "../atoms/Main";
import { Footer } from "../organisms/Footer";
import { Header } from "../organisms/Header";
import { Hero } from "../organisms/Hero";
import { Letter } from "../organisms/Letter";

export const HomeTemplate: React.FC = () => {
  return (
    <Main>
      <Header />
      <Hero />
      <Container>
        <Letter />
      </Container>
      <Footer />
    </Main>
  );
};
