import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface Tag {
	name: string,
	id: string
}

interface Props {
	tags: Tag[],
	setSelectedTags: (addedTags:string[]) => void
}

export default (props: Props) => {
  return (
      <Autocomplete
        multiple
        id="tags-outlined"
        options={props.tags}
        getOptionLabel={(option) => option.name}
        defaultValue={[]}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tags"
          />
        )}
		onChange={(_, value: Tag[]) => props.setSelectedTags(value.map((val: Tag) => val.id))}
      />
  );
}