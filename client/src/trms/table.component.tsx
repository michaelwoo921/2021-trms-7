import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trms } from './trms';

import TrmsRow from './trms-row';
import { TrmsState, UserState } from '../reducer';
import { thunkGetTrmss, thunkGetUser } from '../thunks';

function groupIntoThrees(trmss: Trms[]): Trms[][] {
  let arr: Trms[][] = [];
  for (let i = 0; i < trmss.length; i++) {
    arr.push(trmss.slice(i, i + 1));
  }

  return arr;
}
export default function TableComponent() {
  const selectTrms = (state: TrmsState) => state.trmss;
  const trmss = useSelector(selectTrms);
  const dispatch = useDispatch();

  const user = useSelector((state: UserState) => state.user);
  useEffect(() => {
    dispatch(thunkGetTrmss());
    dispatch(thunkGetUser());
  }, [dispatch]);

  let selectedTrmss = trmss.filter((item: Trms) => {
    if (
      user.role === 'DeptHead' ||
      user.role === 'Benco' ||
      user.name === 'King'
    ) {
      return item;
    } else if (user.role === 'Employee') {
      return item.name === user.name;
    } else {
      // user.role === 'Sup'
      return item.sup_name === user.name || item.name === user.name;
    }
  });

  return (
    <section className="trmss container" id="trmss">
      {groupIntoThrees(selectedTrmss).map((value, index: number) => {
        return <TrmsRow key={'trms-row-' + index} trmss={value}></TrmsRow>;
      })}
    </section>
  );
}
