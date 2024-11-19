import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface Props {
	tags: string[],
	setSelectedTags: (addedTags:string[]) => void
}

export default (props: Props) => {
  return (
      <Autocomplete
        multiple
        id="tags-outlined"
        options={props.tags}
        getOptionLabel={(option) => option}
        defaultValue={[]}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tags"
          />
        )}
		onChange={(_, value: string[]) => props.setSelectedTags(value.map((val: string) => val))}
      />
  );
}