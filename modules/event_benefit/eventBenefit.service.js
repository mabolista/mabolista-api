const models = require("../../core/database/models");

const createEmployeeBenefit = async ({
                               title,
                               image_url,
                               image_public_id,
                               description,
                               location,
                               gmaps_url,
                               notes,
                               player_price,
                               keeper_price,
                               event_date,
                               start_time,
                               end_time
                           }) => {
    const event = await models.Event.create({
        title,
        image_url,
        image_public_id,
        description,
        location,
        gmaps_url,
        notes,
        player_price,
        keeper_price,
        event_date,
        start_time,
        end_time
    });

    return event.toJSON();
};

module,exports = {

}