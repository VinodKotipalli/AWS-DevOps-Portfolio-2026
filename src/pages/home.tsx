import { Approach } from '../sections/approach';
import { Beyond } from '../sections/beyond';
import { Experience } from '../sections/experience';
import { Hero } from '../sections/hero';
import { SecondaryProjects } from '../sections/secondary-projects';
import { Work } from '../sections/work';

export function HomePage() {
  return (
    <>
      <Hero />
      <Approach />
      <Work />
      <SecondaryProjects />
      <Experience />
      <Beyond />
    </>
  );
}
