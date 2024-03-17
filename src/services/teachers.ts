import {Teacher} from '../types';

export const fetchTeacher = async (): Promise<Teacher[]> => {
  try {
    const response = await fetch(
      'https://sameer-ahmed1.github.io/cvrdata/teachers.json',
    );
    const json = await response.json();
    // console.log('json ', json);
    return json;
  } catch (error) {
    throw new Error('Error fetching teachers');
  }
};
