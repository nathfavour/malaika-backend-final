'use client';
import {
  Card,
  Stack,
  Text,
  CardBody,
  Heading,
  CardFooter,
  Flex,
} from '@chakra-ui/react';
import Image from 'next/image';
import cardImg from '../../public/cardImg.svg';
import CustomButton from './CustomButton';
import { LuExternalLink } from 'react-icons/lu';

export default function CardComponent() {
  return (
    <>
      <Card
        direction={{
          base: 'column',
          md: 'row',
        }}
        variant='outline'
        p={4}
        className={`gap-4 even:my-11 shadow-custom pt-8`}
      >
        <Image
          className='object-cover w-full lg:w-auto'
          src={cardImg}
          width={300}
          height={300}
          alt='Card Image'
        />
        <Stack>
          <CardBody>
            <Stack spacing='4rem'>
              {/* 1ST Stack */}
              <Flex
                gap={{
                  base: 8,
                  lg: 16,
                }}
                flexDir={{
                  base: 'column',
                  xl: 'row',
                }}
              >
                <Stack>
                  <Heading size='md'>Project name</Heading>
                  <Text fontSize='sm'>
                    This will be the project description. Short but concise
                  </Text>
                </Stack>
                <Stack>
                  <Heading className='' size='md'>
                    $2,000
                  </Heading>
                  <Text className='' fontSize='sm'>
                    $1,500 raised
                  </Text>
                </Stack>
                <Stack>
                  <Heading size='md'>Token reward</Heading>
                  <Text fontSize='sm'>Holds for 3 months</Text>
                </Stack>
              </Flex>
              {/* 2ND Stack */}
              <Flex
                gap={{
                  base: 8,
                  md: 8,
                }}
                flexDir={{
                  base: 'column',
                  lg: 'row',
                }}
              >
                <Stack>
                  <Heading size='md'>Minimum Buy-in</Heading>
                  <Text className='' fontSize='sm'>
                    $100
                  </Text>
                </Stack>
                <Stack>
                  <Heading size='md'>Timeline</Heading>
                  <Text fontSize='sm'>Ends in 6d 4h 3m 1s</Text>
                </Stack>
              </Flex>
            </Stack>
          </CardBody>
          <CardFooter>
            <CustomButton
              className='w-full px-8 py-6 hover:font-semibold xl:w-fit'
              bgColor='black'
              title='Support'
              icon={LuExternalLink}
              shadow
              textColor='white'
            />
          </CardFooter>
        </Stack>
      </Card>
    </>
  );
}
